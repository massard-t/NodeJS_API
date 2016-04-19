//
//  Debuter_sceance.swift
//  ASPTT
//
//  Created by Sullivan VITIELLO on 14/04/16.
//  Copyright © 2016 Sullivan VITIELLO. All rights reserved.
//

import Foundation

class Sceance : UIViewController {
    override func viewDidLoad() {
        self.view.addGestureRecognizer(self.revealViewController().panGestureRecognizer())
    }
}